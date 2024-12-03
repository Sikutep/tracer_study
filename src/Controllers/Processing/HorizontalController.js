
const KeselarasanHorizontal = require('../../Models/DataProcessing/KeselarasanHorizontal/HasilKeselarasanHorizontalModel')
const OutputHorizontal = require('../../Models/Output/OutputHorizontalModel')

exports.calculateHorizontal = async (req, res) => {
    try {
        const hasilKeselarasan = await KeselarasanHorizontal.find()
            .populate({
                path: 'id_mahasiswa',
                populate: [
                    { path: 'kampus.prodi', select: 'nama _id' },
                    { path: 'kampus.tahun_lulusan', select: 'tahun_lulusan' },
                ],
            });

        if (!hasilKeselarasan.length) {
            return res.status(404).json({ message: 'Data keselarasan horizontal Not Found' });
        }

        let result = [];

        hasilKeselarasan.forEach((item) => {
            const tahunLulusan = item.id_mahasiswa.kampus.tahun_lulusan;
            const jenjang = item.id_mahasiswa.kampus.jenjang;
            const prodi = item.id_mahasiswa.kampus.prodi;

            if (!tahunLulusan || !jenjang || !prodi) {
                console.error('Incomplete data for:', item.id_mahasiswa._id);
                return;
            }

            let group = result.find(
                (r) =>
                    r.tahun_lulusan === tahunLulusan &&
                    r.jenjang === jenjang &&
                    r.prodi.toString() === prodi._id.toString()
            );

            if (!group) {
                group = {
                    tahun_lulusan: tahunLulusan,
                    jenjang: jenjang,
                    prodi: prodi._id,
                    selaras: { jumlah: 0, persentase: '0%' },
                    tidak_selaras: { jumlah: 0, persentase: '0%' },
                };
                result.push(group);
            }

            if (item.selaras) {
                group.selaras.jumlah += 1;
            } else {
                group.tidak_selaras.jumlah += 1;
            }
        });

        result = result.map((group) => {
            const total = group.selaras.jumlah + group.tidak_selaras.jumlah;
            group.selaras.persentase = ((group.selaras.jumlah / total) * 100).toFixed(2) + '%';
            group.tidak_selaras.persentase = ((group.tidak_selaras.jumlah / total) * 100).toFixed(2) + '%';
            return group;
        });

        for (const group of result) {
            const newOutput = new OutputHorizontal({
                tahun_lulusan: group.tahun_lulusan,
                jenjang: group.jenjang,
                prodi: group.prodi,
                keselarasan: {
                    selaras: group.selaras,
                    tidak_selaras: group.tidak_selaras,
                },
            });

            await newOutput.save();
            if (!newOutput) return res.status(400).json({ message : "Failed"})
        }

        console.log('Data keselarasan horizontal calculated and saved successfully.');
        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Unable to Generate', error);
        return res.status(500).json({ message: 'Unable to calculate keselarasan horizontal', error: error.message });
    }
};



