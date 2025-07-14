import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PricingModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (type: "free" | "premium") => void;
}

export default function PricingModal({ open, onClose, onSelect }: PricingModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/10 shadow-xl relative">
                <button
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                        Pilih Paket Biznify
                    </h2>
                    <div className="space-y-4">
                        {/* Free Plan */}
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-white">Rp. 0</span>
                                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">Free</Badge>
                            </div>
                            <ul className="text-slate-300 text-sm list-disc pl-5 mb-2">
                                <li>akses terbatas</li>
                            </ul>
                            <button
                                className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition"
                                onClick={() => onSelect("free")}
                            >
                                Pilih Paket Free
                            </button>
                        </div>
                        {/* Premium Plan */}
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-white">Rp. 85.000</span>
                                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">Premium</Badge>
                            </div>
                            <ul className="text-slate-300 text-sm list-disc pl-5 mb-2">
                                <li>akses tanpa batas</li>
                                <li>mendapatkan hasil resume</li>
                                <li>mendapatkan kesimpulan berupa berkas yang bisa di unduh pdf</li>
                            </ul>
                            <button
                                className="w-full py-2 rounded bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-bold hover:scale-105 transition"
                                onClick={() => onSelect("premium")}
                            >
                                Pilih Paket Premium
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
